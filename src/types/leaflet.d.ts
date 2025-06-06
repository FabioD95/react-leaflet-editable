import "leaflet";

declare module "leaflet" {
  interface Layer {
    _leaflet_id: number;
  }
}
