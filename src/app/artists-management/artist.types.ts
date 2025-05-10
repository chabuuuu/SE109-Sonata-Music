// artist.types.ts
export interface Genre {
    id: number;
    name: string;
    description: string;
    picture: string;
    // Other fields omitted for brevity
  }
  
  export interface Orchestra {
    id: string;
    name: string;
    picture: string;
  }
  
  export interface Period {
    id: number;
    name: string;
    picture: string;
  }
  
  export interface Instrument {
    id: number;
    name: string;
    picture: string;
  }
  
  // This interface represents what comes from the API
  export interface ApiArtistDetails {
    id: number;
    name: string;
    description: string;
    picture: string;
    awardsAndHonors: string;
    nationality: string;
    roles: string[];
    dateOfBirth: string;
    // And other fields from the API
    genres: Genre[];
    orchestras: Orchestra[];
    periods: Period[];
    instruments: Instrument[];
  }
  
  // This interface represents what we want to display
  export interface ArtistDetails {
    id: string;
    name: string;
    genres: string;
    instruments: string;
    nationality: string;
    role: string;
    awardsAndHonors: string;
  }