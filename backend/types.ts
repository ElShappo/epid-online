export type Region = {
  territory: string
  territory_code: string
}

export type PopulationSingleRecord = {
  year: number
  territory: string
  territory_code: string
  age_start: number
  age_end: number
  all: number
  all_men: number
  all_women: number
  urban_all: number,
  urban_men: number,
  urban_women: number,
  rural_all: number,
  rural_men: number,
  rural_women: number
}