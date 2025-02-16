import { useState } from "react";
import Autosuggest from "react-autosuggest";
import { Input } from "@/components/ui/input";

const AutoCompleteProductInput = ({ onSelectProduct }) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async (query: string) => {
    if (!query) return;
    try {
      const response = await fetch(`http://localhost:8000/api/search/?q=${query}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      }
    } catch (error) {
      console.error("Erro ao buscar sugestões:", error);
    }
  };

  const handleSuggestionsFetchRequested = ({ value }: any) => {
    fetchSuggestions(value);
  };

  const handleSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const handleSuggestionSelected = (event: any, { suggestion }: any) => {
    setValue(suggestion.name);
    onSelectProduct(suggestion); // Passa o produto selecionado para o componente pai
  };

  const getSuggestionValue = (suggestion: any) => suggestion.name;

  const renderSuggestion = (suggestion: any) => (
    <div>{suggestion.name}</div>
  );

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
      onSuggestionsClearRequested={handleSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={{
        value,
        onChange: (_, { newValue }) => setValue(newValue),
        placeholder: "Digite o nome do produto",
      }}
    />
  );
};

export default AutoCompleteProductInput;
