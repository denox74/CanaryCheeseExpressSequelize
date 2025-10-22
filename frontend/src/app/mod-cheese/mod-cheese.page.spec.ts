import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModCheesePage } from './mod-cheese.page';

describe('ModCheesePage', () => {
  let component: ModCheesePage;
  let fixture: ComponentFixture<ModCheesePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ModCheesePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
