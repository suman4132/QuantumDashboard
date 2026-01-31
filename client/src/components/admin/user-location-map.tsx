import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Globe } from "lucide-react";
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";

interface UserLocation {
  id: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  userCount: number;
  plan: string;
}

const mockUserLocations: UserLocation[] = [
  { id: "1", city: "New York", country: "USA", lat: 40.7128, lng: -74.0060, userCount: 245, plan: "Premium" },
  { id: "2", city: "London", country: "UK", lat: 51.5074, lng: -0.1278, userCount: 189, plan: "Enterprise" },
  { id: "3", city: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503, userCount: 312, plan: "Premium" },
  { id: "4", city: "San Francisco", country: "USA", lat: 37.7749, lng: -122.4194, userCount: 156, plan: "Enterprise" },
  { id: "5", city: "Berlin", country: "Germany", lat: 52.5200, lng: 13.4050, userCount: 98, plan: "Free" },
  { id: "6", city: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198, userCount: 234, plan: "Premium" },
  { id: "7", city: "Sydney", country: "Australia", lat: -33.8688, lng: 151.2093, userCount: 167, plan: "Premium" },
  { id: "8", city: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832, userCount: 123, plan: "Free" },
  { id: "9", city: "Mumbai", country: "India", lat: 19.0760, lng: 72.8777, userCount: 445, plan: "Enterprise" },
  { id: "10", city: "Paris", country: "France", lat: 48.8566, lng: 2.3522, userCount: 201, plan: "Premium" },
];

function MapCenterSetter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export function UserLocationMap() {
  const [locations] = useState<UserLocation[]>(mockUserLocations);
  const [selectedLocation, setSelectedLocation] = useState<UserLocation | null>(null);
  const [mapCenter] = useState<[number, number]>([20, 0]);

  const totalUsers = locations.reduce((sum, loc) => sum + loc.userCount, 0);
  const totalLocations = locations.length;

  const getMarkerColor = (plan: string) => {
    switch (plan) {
      case "Enterprise":
        return "#8b5cf6";
      case "Premium":
        return "#3b82f6";
      default:
        return "#10b981";
    }
  };

  const getMarkerSize = (userCount: number) => {
    if (userCount > 300) return 20;
    if (userCount > 150) return 15;
    return 10;
  };

  return (
    <Card className="col-span-full border-2 hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Globe className="h-6 w-6 text-blue-500" />
              Global User Distribution
            </CardTitle>
            <CardDescription className="mt-1">
              Real-time user locations and activity across the world
            </CardDescription>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalLocations}</div>
              <div className="text-xs text-muted-foreground">Locations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalUsers}</div>
              <div className="text-xs text-muted-foreground">Total Users</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <div className="h-[400px] rounded-lg overflow-hidden border border-border">
              <MapContainer
                center={mapCenter}
                zoom={2}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapCenterSetter center={mapCenter} />
                {locations.map((location) => (
                  <CircleMarker
                    key={location.id}
                    center={[location.lat, location.lng]}
                    radius={getMarkerSize(location.userCount)}
                    fillColor={getMarkerColor(location.plan)}
                    color={getMarkerColor(location.plan)}
                    weight={2}
                    opacity={0.8}
                    fillOpacity={0.6}
                    eventHandlers={{
                      click: () => setSelectedLocation(location),
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold text-sm">{location.city}, {location.country}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          <Users className="inline h-3 w-3 mr-1" />
                          {location.userCount} users
                        </p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {location.plan}
                        </Badge>
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </div>
          
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-blue-500" />
              Top Locations
            </h4>
            {locations
              .sort((a, b) => b.userCount - a.userCount)
              .slice(0, 8)
              .map((location) => (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  onClick={() => setSelectedLocation(location)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedLocation?.id === location.id
                      ? "bg-primary/10 border-primary"
                      : "bg-card hover:bg-accent/50 border-border"
                  }`}
                  data-testid={`location-item-${location.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: getMarkerColor(location.plan) }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{location.city}</p>
                        <p className="text-xs text-muted-foreground truncate">{location.country}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-sm font-bold">{location.userCount}</p>
                      <Badge variant="outline" className="text-[10px] px-1 py-0">
                        {location.plan}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
