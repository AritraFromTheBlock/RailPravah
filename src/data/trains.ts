export type Train = {
  id: number
  number: string
  name: string
  from: string
  to: string
  departure: string
  arrival: string
}

export const trains: Train[] = [
  {
    id: 1,
    number: '12301',
    name: 'Howrah Rajdhani Express',
    from: 'Howrah',
    to: 'New Delhi',
    departure: '16:55',
    arrival: '10:00',
  },
  {
    id: 2,
    number: '12019',
    name: 'Howrah Ranchi Shatabdi',
    from: 'Howrah',
    to: 'Ranchi',
    departure: '06:05',
    arrival: '10:00',
  },
  {
    id: 3,
    number: '12314',
    name: 'Sealdah Rajdhani Express',
    from: 'Sealdah',
    to: 'New Delhi',
    departure: '16:50',
    arrival: '10:50',
  },
  {
    id: 4,
    number: '12841',
    name: 'Coromandel Express',
    from: 'Howrah',
    to: 'Chennai',
    departure: '14:50',
    arrival: '17:00',
  },
]