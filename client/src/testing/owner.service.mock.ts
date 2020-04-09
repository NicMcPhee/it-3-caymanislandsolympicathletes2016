import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Owner } from '../app/owner';
import { OwnerService } from '../app/owner.service';

/**
 * A "mock" version of the `OwnerService` that can be used to test components
 * without having to create an actual service.
 */
@Injectable()
export class MockOwnerService extends OwnerService {
  static testOwners: Owner[] = [
    {
      _id: 'rachel_id',
      name: 'Rachel Johnson',
      officeNumber: '1234',
      email: 'rmjohns@morris.umn.edu',
      building: 'Science',
      x500: 'rmjohns'
    },
    {
      _id: 'joe_id',
      name: 'Joe Beaver',
      officeNumber: '5678',
      email: 'jbeaver@morris.umn.edu',
      building: 'Imholte',
      x500: 'jbeaver'
    },
    {
      _id: 'james_id',
      name: 'James Flegel',
      officeNumber: '9012',
      email: 'fleg0003@morris.umn.edu',
      building: 'HFA',
      x500: 'fleg0003'
    },
    {
      _id: 'kyle_id',
      name: 'Kyle Fluto',
      officeNumber: '2716',
      email: 'fluto006@umn.edu',
      building: 'Science',
      x500: 'fluto006'
    }
  ];

  constructor() {
    super(null);
  }
  // no filters here yet, don't know what we want to have the database filter for us
  getOwners(filters: {  }): Observable<Owner[]> {
    // Just return the test owners regardless of what filters are passed in
    return of(MockOwnerService.testOwners);
  }

  getOwnerById(id: string): Observable<Owner> {
    // If the specified ID is for the first test owner,
    // return that owner, otherwise return `null` so
    // we can test illegal owner requests.
    if (id === MockOwnerService.testOwners[0]._id) {
      return of(MockOwnerService.testOwners[0]);
    } else {
      return of(null);
    }
  }

  getOwnerByx500(x500: string): Observable<Owner> {
    // If the specified ID is for the first test owner,
    // return that owner, otherwise return `null` so
    // we can test illegal owner requests.
    if (x500 === MockOwnerService.testOwners[0].x500) {
      return of(MockOwnerService.testOwners[0]);
    } else {
      return of(null);
    }
  }
}
