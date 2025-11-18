import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestCameraPage } from './test-camera.page';

describe('TestCameraPage', () => {
  let component: TestCameraPage;
  let fixture: ComponentFixture<TestCameraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestCameraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
