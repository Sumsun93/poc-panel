export interface Character {
  'id': number,
  'teamspeak': string,
  'online': boolean,
  'firstname': string,
  'lastname': string,
  'position': {
    'x': number,
    'y': number,
    'z': number
  },
  'rotation': number,
  'hunger': number,
  'thirst': number,
  'health': number,
  'dimension': number,
  'inventory_id': number
}
