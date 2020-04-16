import { Component, OnInit, OnDestroy } from '@angular/core';
import { Note } from '../note';
import { NotesService } from '../notes.service';
import { OwnerService } from '../owner.service';
import { AuthService } from '../authentication/auth.service';
import { Subscription } from 'rxjs';
import { Owner } from '../owner';


@Component({
  selector: 'trash.component',
  templateUrl: 'trash.component.html',
  styleUrls: ['./trash.component.scss'],
  providers: []
})

export class TrashComponent implements OnInit, OnDestroy  {
  // These are public so that tests can reference them (.spec.ts)
  public serverFilteredNotes: Note[];
  // public filteredNotes: Note[];
  public trash: boolean;
  owner: Owner;
  getNotesSub: Subscription;
  posted: boolean;
  notes: Note[];
  id: string;
  name: string;
  getOwnerSub: Subscription;
  getx500Sub: Subscription;
  x500: string;


  // Inject the NoteService into this component.
  // That's what happens in the following constructor.
  //
  // We can call upon the service for interacting
  // with the server.

  constructor(private noteService: NotesService, private ownerService: OwnerService,
              private auth: AuthService) {

  }

  restoreNote(id: string): void {
    this.noteService.restoreNote(id).subscribe(result => {
      // Ignore the result for now.
      this.retrieveNotes();
    }, err => {
      console.log(err);
    });
  }

  permanentlyDeleteNote(id: string): void {
    this.noteService.permanentlyDeleteNote(id).subscribe(result => {
      this.retrieveNotes();
    }, err => {
      console.log(err);
    });
  }

  async retrieveNotes() {
    if (this.ownerService.owner == null) {
      let foundOwner = await this.ownerService.retrieveOwner();
    }
    this.owner = this.ownerService.owner;
    this.getNotesSub = this.noteService.getOwnerNotes({owner_id: this.owner._id, posted: false}).subscribe(returnedNotes => {
      this.notes = returnedNotes.reverse();
    }, err => {
      console.log(err);
    });
  }

  /**
   * Starts an asynchronous operation to update the notes reuse
   *
   */
  ngOnInit(): void {
    this.retrieveNotes();
  }

  ngOnDestroy(): void {
    this.unsub();
  }

  unsub(): void {
    if (this.getNotesSub) {
      this.getNotesSub.unsubscribe();
    }
    if (this.getOwnerSub) {
      this.getOwnerSub.unsubscribe();
    }
  }
}
