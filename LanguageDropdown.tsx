import React, { useState } from 'react';

type Language = {
  id: string;
  language: string;
};

type Props = {
  options: Language[];
  onSelect: (selectedId: string) => void;
};

const LanguageDropdown: React.FC<Props> = ({ options, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Language | null>(null);

  const filteredOptions = options.filter(opt =>
    opt.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option: Language) => {
    setSelected(option);
    onSelect(option.id);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative w-72">
      <div
        className="border border-gray-300 rounded-lg px-4 py-2 cursor-pointer bg-white shadow-sm"
        onClick={() => setIsOpen(prev => !prev)}
      >
        {selected ? selected.language : 'Select Language'}
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
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
    </div>
  );
};

export default LanguageDropdown;
