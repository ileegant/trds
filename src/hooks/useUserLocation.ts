import { useState, useEffect } from "react";

export const useUserLocation = () => {
  // Початковий стан може бути пустим або "Завантаження..."
  const [location, setLocation] = useState<string>("");

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const res = await fetch(
          "https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=uk"
        );
        const data = await res.json();

        // Шукаємо специфічне місто (adminLevel 8)
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
             // Fallback, якщо місто не знайдено, але запит успішний
             setLocation("Україна");
        }
      } catch (e) {
        // Логіка помилки
        setLocation("Україна (Інтернет)");
      }
    };

    fetchLocation();
  }, []);

  return location;
};