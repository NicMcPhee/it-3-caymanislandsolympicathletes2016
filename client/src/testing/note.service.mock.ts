import { Injectable } from '@angular/core';
import { NotesService } from '../app/notes.service';
import { Note } from '../app/note';
import { of } from 'rxjs';

@Injectable()
export class MockNoteService extends NotesService {

  static testNotes: Note[] = [
    // Posted Notes
    {
      _id: 'first_posted_id',
      owner_id: 'rachel_id',
      body: 'This is the first "posted" note',
      posted: true,
      pinned: false
    },
    {
      _id: 'second_posted_id',
      owner_id: 'joe_id',
      body: 'This is the second "posted" note',
      posted: true,
      pinned: false
    },
    {
      _id: 'third_posted_id',
      owner_id: 'james_id',
      body: 'This is the third "posted" note',
      posted: true,
      pinned: false
    },

    // Pinned Notes
    {
      _id: 'fourth_id',
      owner_id: 'rachel_id',
      body: 'This is the first pinned note',
      posted: true,
      pinned: true
    },
    {
      _id: 'fifth_id',
      owner_id: 'joe_id',
      body: 'This is the second note',
      posted: true,
      pinned: true
    },
    {
      _id: 'sixth_id',
      owner_id: 'james_id',
      body: 'This is the third note',
      posted: true,
      pinned: true
    },

    // Trashed Notes
    {
      _id: 'fourth_id',
      owner_id: 'rachel_id',
      body: 'This is the fourth note',
      posted: false,
      pinned: false
    },
    {
      _id: 'fifth_id',
      owner_id: 'joe_id',
      body: 'This is the fifth note',
      posted: false,
      pinned: false
    },
    {
      _id: 'sixth_id',
      owner_id: 'james_id',
      body: 'This is the 6th note',
      posted: false,
      pinned: false
    },
    {
      _id: 'seventh_id',
      owner_id: 'kyle_id',
      body: 'This is the 7th note',
      posted: false,
      pinned: false
    }
  ];

  public static FAKE_BODY = 'This is definitely the note you wanted';

  constructor() {
    super(null);
  }

  getNotes() {
    return of(MockNoteService.testNotes);
  }

  deleteNote(id: string) {
    return of(true);
  }

  addNote(note) {
    return of('I just put your note in the database and this is its new ID');
  }

  editNote(note: Note, id: string) {
    return of(id);
  }

  getNoteById(id: string) {
    return of({
      _id: id,
      owner_id: 'rachel_id',
      body: MockNoteService.FAKE_BODY,
      posted: true,
      pinned: true
    });
  }
}
