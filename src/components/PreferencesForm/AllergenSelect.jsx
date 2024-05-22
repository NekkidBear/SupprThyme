import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import axios from "axios";

const AllergenSelect = ({ selectedAllergens, setSelectedAllergens }) => {
  const [allergenOptions, setAllergenOptions] = useState([]);

  useEffect(() => {
    const fetchAllergenOptions = async () => {
      try {
        const response = await axios.get("/api/form_data/allergen-options");
        setAllergenOptions(response.data);
        console.allergenOptions
      } catch (error) {
        console.error("Error fetching allergen options:", error);
      }
    };

    fetchAllergenOptions();
  }, []);

  const handleAllergenChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedAllergens(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel id="allergen-select-label">Allergens</InputLabel>
      <Select
        labelId="allergen-select-label"
        multiple
        value={selectedAllergens}
        onChange={handleAllergenChange}
        input={<OutlinedInput label="Allergens" />}
        renderValue={(selected) => 
          selected
            .map((allergenId) => allergenOptions.find((a) => a.id === allergenId)?.name)
            .join(", ")
        }
      >
        {allergenOptions.map((allergen) => (
          <MenuItem key={allergen.id} value={allergen.id}>
            <Checkbox checked={selectedAllergens.includes(allergen.id)} />
            <ListItemText primary={allergen.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default AllergenSelect;
