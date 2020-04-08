package umm3601.notes;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;

import java.util.ArrayList;
import java.util.List;

import com.google.common.collect.ImmutableMap;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.result.DeleteResult;

import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Updates.set;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonCodecRegistry;

import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;
import io.javalin.http.UnauthorizedResponse;
import umm3601.TokenVerifier;
import umm3601.owners.Owner;
import umm3601.owners.OwnerController;

public class NoteController {

  JacksonCodecRegistry jacksonCodecRegistry = JacksonCodecRegistry.withDefaultObjectMapper();

  private MongoCollection<Owner> ownerCollection;
  private final MongoCollection<Note> noteCollection;
  private final TokenVerifier tokenVerifier;
  private final OwnerController ownerController;

  public static final String DELETED_RESPONSE = "deleted";
  public static final String NOT_DELETED_RESPONSE = "nothing deleted";

  public NoteController(MongoDatabase database) {
    jacksonCodecRegistry.addCodecForClass(Note.class);
    noteCollection = database.getCollection("notes").withDocumentClass(Note.class)
        .withCodecRegistry(jacksonCodecRegistry);

    ownerController = new OwnerController(database);
    tokenVerifier = new TokenVerifier();
  }

  public boolean verifyHttpRequest(Context ctx) throws Exception {
    if (!this.tokenVerifier.verifyToken(ctx)) {
      throw new BadRequestResponse("Invalid header token. The request is not authorized.");
    } else {
      return true;
    }
  }

  public void checkOwnerForNewNote(Context ctx) {
    String x500 = tokenVerifier.getOwnerx500(ctx);
    String ownerID = ownerController.getOwnerIDByx500(x500);

    Note newNote = ctx.bodyAsClass(Note.class);

    if(!ownerID.equals(newNote.owner_id)) {
      ctx.status(401);
      throw new UnauthorizedResponse("You do not have permission to perform this action.");
    }
  }

  public void checkOwnerForGivenNote(Context ctx) {
    String x500 = tokenVerifier.getOwnerx500(ctx);
    String ownerID = ownerController.getOwnerIDByx500(x500);

    String noteID = ctx.pathParam("id");
    Note note;

    try {
    note = noteCollection.find(eq("_id", new ObjectId(noteID))).first();
    }  catch(IllegalArgumentException e) {
      throw new BadRequestResponse("The requested note id wasn't a legal Mongo Object ID.");
    }

    if (note == null) {
      throw new NotFoundResponse("The requested note was not found");
    } else if (!ownerID.equals(note.owner_id)) {
      ctx.status(401);
      throw new UnauthorizedResponse("You do not have permission to perform this action.");
    }
  }

  public void getNoteByID(Context ctx) {
    String id = ctx.pathParam("id");
    Note note;

    try {
      note = noteCollection.find(eq("_id", new ObjectId(id))).first();
    } catch(IllegalArgumentException e) {
      throw new BadRequestResponse("The requested note id wasn't a legal Mongo Object ID.");
    }
    if (note == null) {
      throw new NotFoundResponse("The requested note was not found");
    } else {
      ctx.json(note);
    }
  }

  public void getOwnerNotes(Context ctx) {

    List<Bson> filters = new ArrayList<Bson>(); // start with a blank document

    if (ctx.queryParamMap().containsKey("owner_id")) {
      filters.add(eq("owner_id", ctx.queryParam("owner_id")));
    }

    ctx.json(noteCollection.find(filters.isEmpty() ? new Document() : and(filters))
    .into(new ArrayList<>()));
  }

  public void getNotes(Context ctx) {
    ctx.json(noteCollection.find(new Document()).into(new ArrayList<>()));
  }

  public void addNote(Context ctx) {

    Note newNote = ctx.bodyValidator(Note.class)
    .check((note) -> note.body.length() >= 2 && note.body.length() <= 300).get();

    noteCollection.insertOne(newNote);
    ctx.status(201);
    ctx.json(ImmutableMap.of("id", newNote._id));
  }

  public void editNote(Context ctx) {
    String id = ctx.pathParamMap().get("id");

    Note newNote= ctx.bodyValidator(Note.class)
    .check((note) -> note.body.length() >= 2 && note.body.length() <= 300).get();
    String newBody = newNote.body;

    Note oldNote = noteCollection.findOneAndUpdate(eq("_id", new ObjectId(id)), set("body", newBody));

    if (oldNote == null) {
      ctx.status(400);
      throw new NotFoundResponse("The requested note was not found");
    } else {
      ctx.status(200);
      ctx.json(ImmutableMap.of("id", id));
    }
  }

  /**
   * Delete a note with a given id, if the id exists.
   *
   * If the id does not exist, do nothing.
   */
  public void deleteNote(Context ctx) {
    String id = ctx.pathParam("id");
    DeleteResult result = noteCollection.deleteOne(eq("_id", new ObjectId(id)));

    if (result.getDeletedCount() > 0) {
      ctx.result(DELETED_RESPONSE);
    } else {
      // Deleting a non-existent id is still considered a success.
      ctx.result(NOT_DELETED_RESPONSE);
    }
  }
}
