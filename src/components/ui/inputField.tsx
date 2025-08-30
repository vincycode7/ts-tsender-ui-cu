import React from 'react';

interface InputFieldProps {
  label: string;
  placeholder: string;
  value: string;
  type?: React.HTMLInputTypeAttribute;
  large?: boolean;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  value,
  type = 'text',
  large = false,
  onChange,
}) => {
  const baseStyles =
    'w-full px-3 pt-1 pb-20 mb-5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  const textareaStyles = large ? `${baseStyles} h-32 resize-none` : baseStyles;

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-gray-700 mt-2">{label}</label>
      {large ? (
        <textarea
          className={textareaStyles}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      ) : (
        <input
          className={baseStyles}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default InputField;
