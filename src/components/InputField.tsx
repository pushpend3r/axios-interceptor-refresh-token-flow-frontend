interface InputFieldProps {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (value: any) => void;
}

const InputField = ({
  type,
  name,
  placeholder,
  value,
  label,
  onChange,
}: InputFieldProps) => {
  return (
    <>
      <div className="input-group flex-nowrap">
        <span className="input-group-text" id={name}>
          {label}
        </span>
        <input
          className="form-control"
          type={type}
          aria-label={name}
          aria-describedby={name}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </div>
      <br />
    </>
  );
};

export default InputField;
