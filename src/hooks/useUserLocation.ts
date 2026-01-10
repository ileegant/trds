import { useState, useEffect } from "react";

export const useUserLocation = () => {
  const [location, setLocation] = useState<string>("");

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch(
          "https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=uk"
        );
        const data = await res.json();

        const specificCity = data.localityInfo?.administrative?.find(
          (item: any) => item.adminLevel === 8 || item.order === 8
        );

        const cityName = specificCity
          ? specificCity.name
          : data.city || data.locality;
        const countryName = data.countryName || "Україна";

        if (cityName) {
          setLocation(`${cityName}, ${countryName}`);
        } else {
          setLocation("Україна");
        }
      } catch (e) {
        setLocation("Україна (Інтернет)");
      }
    };

    fetchLocation();
  }, []);

  return location;
};
