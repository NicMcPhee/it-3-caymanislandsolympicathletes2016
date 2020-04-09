package umm3601;

import java.util.Arrays;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

import io.javalin.Javalin;
import umm3601.notes.NoteController;
import umm3601.owners.OwnerController;


public class Server {

  private static MongoDatabase database;

  public static void main(String[] args) {

    // Get the MongoDB address and database name from environment variables and
    // if they aren't set, use the defaults of "localhost" and "dev".
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");
    String databaseName = System.getenv().getOrDefault("MONGO_DB", "dev");

    // Setup the MongoDB client object with the information we set earlier
    MongoClient mongoClient = MongoClients.create(
      MongoClientSettings.builder()
      .applyToClusterSettings(builder ->
        builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
      .build());

    // Get the database
    database = mongoClient.getDatabase(databaseName);

    // Initialize dependencies here ...
    NoteController noteController = new NoteController(database);
    OwnerController ownerController = new OwnerController(database);

    Javalin server = Javalin.create().start(4567);

    // Note endpoints
    // List notes
    server.get("api/notes", noteController::getOwnerNotes);

    // Add new note
    server.before("api/new/notes/", noteController::verifyHttpRequest);
    server.before("api/new/notes/", noteController::checkOwnerForNewNote);
    server.post("api/new/notes/", noteController::addNote);

    // Get a single note
    server.before("api/notes/:id", noteController::verifyHttpRequest);
    server.before("api/notes/:id", noteController::checkOwnerForGivenNote);
    server.get("api/notes/:id", noteController::getNoteByID);

    // Edit an existing note
    server.before("api/notes/edit/:id", noteController::verifyHttpRequest);
    server.before("api/notes/edit/:id", noteController::checkOwnerForGivenNote);
    server.post("api/notes/edit/:id", noteController::editNote);

    // Trash a note
    server.before("api/notes/:id", noteController::verifyHttpRequest);
    server.before("api/notes/:id", noteController::checkOwnerForGivenNote);
    server.delete("api/notes/:id", noteController::deleteNote);

    // Restore a note
    server.before("api/notes/:id", noteController::verifyHttpRequest);
    server.before("api/notes/:id", noteController::checkOwnerForGivenNote);
    server.post("api/notes/:id", noteController::restoreNote);

    // Delete a note
    server.before("api/notes/delete/:id", noteController::verifyHttpRequest);
    server.before("api/notes/delete/:id", noteController::checkOwnerForGivenNote);
    server.delete("api/notes/delete/:id", noteController::permanentlyDeleteNote);

    // Owner Endpoints
    // Add a new owner
    server.before("api/owner/new", ownerController::verifyHttpRequest);
    server.post("api/owner/new", ownerController::addOwner);

    // Get owner by id
    server.before("api/owner/:id", ownerController::verifyHttpRequest);
    server.get("api/owner/:id", ownerController::getOwnerByID);

    // Get owner by x500
    // server.before("api/owner/x500/:x500", ownerController::verifyHttpRequest);
    server.get("api/owner/x500/:x500", ownerController::getOwnerByx500);


    server.exception(Exception.class, (e, ctx) -> {
      ctx.status(500);
      ctx.json(e); // you probably want to remove this in production
    });
  }
}
