
import React, { useEffect, useRef, useState } from 'react';
import { useField } from 'formik';

type Language = {
  id: string;
  language: string;
};

type Props = {
  label?: string;
  name: string;
  options: Language[];
};

const LanguageSelect: React.FC<Props> = ({ label, name, options }) => {
  const [field, meta, helpers] = useField(name);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openUpward, setOpenUpward] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.id === field.value);

  const filteredOptions = options.filter(opt =>
    opt.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option: Language) => {
    helpers.setValue(option.id);
    setIsOpen(false);
    setSearchTerm('');
  };

  const checkDropdownPosition = () => {
    const dropdown = dropdownRef.current;
    if (!dropdown) return;

    const rect = dropdown.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // If less than 200px below and more above, open upward
    setOpenUpward(spaceBelow < 200 && spaceAbove > 200);
  };

  useEffect(() => {
    if (isOpen) {
      checkDropdownPosition();
    }
  }, [isOpen]);

  return (
    <div className="relative w-72" ref={dropdownRef}>
      {label && <label className="block mb-1 text-sm font-medium">{label}</label>}

      <div
        className={`border px-4 py-2 rounded-lg cursor-pointer bg-white ${
          meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption ? selectedOption.language : 'Select Language'}
      </div>

      {isOpen && (
        <div
          className={`absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg ${
            openUpward ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none"
          />
          <ul className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => (
                <li
                  key={opt.id}
                  onClick={() => handleSelect(opt)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {opt.language}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No matches found</li>
            )}
          </ul>
        </div>
      )}

      {meta.touched && meta.error && (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      )}
    </div>
  );
};

export default LanguageSelect;
import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import LanguageSelect from './LanguageSelect';

const languageOptions = [
  { id: 'AB', language: 'Abkhazian' },
  { id: 'EN', language: 'English' },
  { id: 'FR', language: 'French' },
  { id: 'ES', language: 'Spanish' },
  { id: 'ZH', language: 'Chinese' },
  // add more if needed
];

const validationSchema = Yup.object({
  language: Yup.string().required('Language is required'),
});

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Formik
        initialValues={{ language: '' }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log('Selected:', values);
        }}
      >
        <Form className="space-y-6 bg-white p-6 rounded-lg shadow-md">
          <LanguageSelect
            label="Choose a Language"
            name="language"
            options={languageOptions}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Submit
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default App;
