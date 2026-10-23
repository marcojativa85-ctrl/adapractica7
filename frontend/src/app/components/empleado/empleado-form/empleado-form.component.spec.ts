import { NgForm } from '@angular/forms';
import { EmpleadoFormComponent } from './empleado-form.component';

describe('EmpleadoFormComponent', () => {
  let component: EmpleadoFormComponent;

  beforeEach(() => {
    component = new EmpleadoFormComponent();
  });

  it('emits validation details for invalid form submissions', () => {
    const markAllAsTouched = jasmine.createSpy('markAllAsTouched');
    const form = {
      valid: false,
      control: { markAllAsTouched },
      controls: {
        sueldo: {
          errors: { min: { min: 0.01, actual: -500 } }
        }
      }
    } as unknown as NgForm;
    let errors: string[] | undefined;
    component.formularioInvalido.subscribe((details) => errors = details);
    const submit = spyOn(component.submitEmpleado, 'emit');

    component.onSubmit(form);

    expect(markAllAsTouched).toHaveBeenCalled();
    expect(errors).toEqual(['Sueldo mensual: debe ser mayor a 0.']);
    expect(submit).not.toHaveBeenCalled();
  });
});
