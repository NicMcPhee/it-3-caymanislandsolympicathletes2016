import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from '../../testing/activated-route-stub';
import { MockOwnerService } from '../../testing/owner.service.mock';
import { Owner } from './owner';
import { OwnerComponent } from './owner.component';
import { OwnerService } from './owner.service';
import { NotesService } from '../notes.service';
import { MockNoteService } from 'src/testing/note.service.mock';
import { RouterTestingModule } from '@angular/router/testing';

describe('OwnerDoorBoardComponent', () => {
  let doorBoardComponent: OwnerComponent;
  let fixture: ComponentFixture<OwnerComponent>;
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatCardModule,
        MatListModule
      ],
      declarations: [OwnerComponent],
      providers: [
        { provide: OwnerService, useValue: new MockOwnerService() },
        { provide: NotesService, useValue: new MockNoteService() },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OwnerComponent);
    doorBoardComponent = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the component', () => {
    expect(doorBoardComponent).toBeTruthy();
  });

  it('should navigate to a specific owner doorboard', () => {
    const expectedOwner: Owner = MockOwnerService.testOwners[0];
    // Setting this should cause anyone subscribing to the paramMap
    // to update. Our `OwnerDoorBoardComponent` subscribes to that, so
    // it should update right away.
    activatedRoute.setParamMap({ id: expectedOwner._id });

    expect(doorBoardComponent.id).toEqual(expectedOwner._id);
    expect(doorBoardComponent.owner).toEqual(expectedOwner);
  });

  it('should navigate to correct owner when the id parameter changes', () => {
    let expectedOwner: Owner = MockOwnerService.testOwners[0];
    // Setting this should cause anyone subscribing to the paramMap
    // to update. Our `OwnerDoorBoardComponent` subscribes to that, so
    // it should update right away.
    activatedRoute.setParamMap({ id: expectedOwner._id });

    expect(doorBoardComponent.id).toEqual(expectedOwner._id);

    // Changing the paramMap should update the displayed owner doorboard.
    expectedOwner = MockOwnerService.testOwners[1];
    activatedRoute.setParamMap({ id: expectedOwner._id });

    expect(doorBoardComponent.id).toEqual(expectedOwner._id);
  });

  it('should have `null` for the owner for a bad ID', () => {
    activatedRoute.setParamMap({ id: 'badID' });

    // If the given ID doesn't map to a owner, we expect the service
    // to return `null`, so we would expect the component's owner
    // to also be `null`.
    expect(doorBoardComponent.id).toEqual('badID');
    expect(doorBoardComponent.owner).toBeNull();
  });

});
