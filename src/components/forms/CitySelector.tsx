
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { City, State } from "@/types/models";

interface CitySelectorProps {
  states: State[];
  cities: City[];
  selectedStateId?: number | null;
  selectedCityId?: number | null;
  onStateChange: (stateId: string) => void;
  onCityChange: (cityId: string) => void;
  label?: boolean;
}

const CitySelector = ({
  states,
  cities,
  selectedStateId,
  selectedCityId,
  onStateChange,
  onCityChange,
  label = true,
}: CitySelectorProps) => {
  const [filteredCities, setFilteredCities] = useState<City[]>([]);

  useEffect(() => {
    if (selectedStateId) {
      const filtered = cities.filter(
        (city) => 
          typeof city.state === "number" 
            ? city.state === selectedStateId
            : city.state.id === selectedStateId
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [selectedStateId, cities]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {label && <Label htmlFor="state-select">State</Label>}
        <Select
          value={selectedStateId?.toString() || ""}
          onValueChange={onStateChange}
        >
          <SelectTrigger id="state-select">
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent>
            {states.map((state) => (
              <SelectItem key={state.id} value={state.id.toString()}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        {label && <Label htmlFor="city-select">City</Label>}
        <Select
          value={selectedCityId?.toString() || ""}
          onValueChange={onCityChange}
          disabled={!selectedStateId || filteredCities.length === 0}
        >
          <SelectTrigger id="city-select">
            <SelectValue placeholder={
              !selectedStateId 
                ? "Select a state first" 
                : filteredCities.length === 0 
                  ? "No cities available" 
                  : "Select a city"
            } />
          </SelectTrigger>
          <SelectContent>
            {filteredCities.map((city) => (
              <SelectItem key={city.id} value={city.id.toString()}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CitySelector;
