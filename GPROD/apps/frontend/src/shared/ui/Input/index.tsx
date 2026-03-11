import { StyledInput, StyledTextArea } from './styled';

interface InputProps {
  type?: 'text' | 'date' | 'number' | 'email' | 'password' | 'textarea';
  placeholder?: string;
  value?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  ...rest
}) => {
  if (type === 'textarea') {
    return (
      <StyledTextArea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...rest}
      />
    );
  }

  return (
    <StyledInput
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
};
