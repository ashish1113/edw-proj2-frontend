import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueDescriptionViewComponent } from './issue-description-view.component';

describe('IssueDescriptionViewComponent', () => {
  let component: IssueDescriptionViewComponent;
  let fixture: ComponentFixture<IssueDescriptionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssueDescriptionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssueDescriptionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
