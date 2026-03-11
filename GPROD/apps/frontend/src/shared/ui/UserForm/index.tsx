import { useTheme } from '@emotion/react';
import { Link } from '@tanstack/react-router';
import { Formik, Field } from 'formik';
import React, { useState } from 'react';
import { Flex } from '../Flex';
import { Typography } from '../Typography';
import GoogleIcon from './assets/icons/google.svg';
import WalletIcon from './assets/icons/wallet.svg';
import { type ISignFormProps } from './model/types';
import {
  StyledForm,
  InputField,
  ErrorText,
  SubmitButton,
  SignWithButton,
  FormLink,
} from './styled';
import { UserFormPasswordEye } from './ui/UserFormPasswordEye';

export const UserForm: React.FC<ISignFormProps> = ({
  isSignInPage,
  titleText,
  submitText,
  footerText,
  footerLink,
  inputs,
  onSubmit,
}) => {
  const theme = useTheme();

  const [passwordVisibility, setPasswordVisibility] = useState<Record<string, boolean>>({});

  const togglePasswordVisibility = (inputName: string): void => {
    setPasswordVisibility(prev => ({
      ...prev,
      [inputName]: !prev[inputName],
    }));
  };

  const initialValues = inputs.reduce(
    (acc, input) => {
      acc[input.name] = '';
      return acc;
    },
    {} as Record<string, string>
  );

  const validateForm = (values: Record<string, string>): Record<string, string> => {
    const errors: Record<string, string> = {};
    inputs.forEach(input => {
      if (!values[input.name]) {
        errors[input.name] = `Enter ${input.name}`;
      }
    });
    return errors;
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validateForm}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <StyledForm>
          <Flex
            w="100%"
            justifyContent="center"
          >
            <Typography variant="h3">{titleText}</Typography>
          </Flex>
          <Flex
            flexDirection="column"
            gap="8px"
          >
            {inputs.map(({ name, type, placeholder }) => (
              <Flex
                key={name}
                minH="70px"
                flexDirection="column"
                position="relative"
              >
                <Field
                  as={InputField}
                  type={type === 'password' && passwordVisibility[name] ? 'text' : type}
                  name={name}
                  placeholder={placeholder}
                />
                {type === 'password' && (
                  <UserFormPasswordEye
                    toggleVisibility={() => togglePasswordVisibility(name)}
                    isVisible={passwordVisibility[name]}
                  />
                )}
                <ErrorText
                  name={name}
                  component="p"
                />
              </Flex>
            ))}
          </Flex>
          {isSignInPage && (
            <Typography variant="body1">
              <FormLink to="">Forgot-password</FormLink>
            </Typography>
          )}

          <SubmitButton
            type="submit"
            disabled={isSubmitting}
          >
            {submitText}
          </SubmitButton>

          {(isSignInPage || footerText) && (
            <Flex
              h="1.5px"
              bg={theme.primary.main}
              w="100%"
            />
          )}
          {isSignInPage && (
            <>
              <FormLink to="">
                <SignWithButton>
                  <img
                    src={WalletIcon}
                    alt="wallet"
                  />
                  Continue with CryptoWallet
                </SignWithButton>
              </FormLink>
              <FormLink to="">
                <SignWithButton>
                  <img
                    src={GoogleIcon}
                    alt="google"
                  />
                  Continue with Google
                </SignWithButton>
              </FormLink>
            </>
          )}
          {footerText && (
            <Flex
              w="100%"
              justifyContent="center"
            >
              <Typography variant="body1">
                {footerText} {footerLink && <FormLink to={footerLink}>{footerLink}</FormLink>}
              </Typography>
            </Flex>
          )}
        </StyledForm>
      )}
    </Formik>
  );
};
