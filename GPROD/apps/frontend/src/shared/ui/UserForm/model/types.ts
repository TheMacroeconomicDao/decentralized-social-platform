import { type FormikHelpers } from 'formik';

export interface IInputFieldProps {
  name: string;
  type: string;
  placeholder: string;
}

export interface ISignFormProps {
  isSignInPage?: boolean;
  titleText: string;
  submitText: string;
  footerText?: string;
  footerLink?: string;
  inputs: IInputFieldProps[];
  onSubmit: (
    values: Record<string, string>,
    formikHelpers: FormikHelpers<Record<string, string>>
  ) => void;
}
