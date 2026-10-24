// Christmas is the default occasion; a season is "over" once the Christmas it
// was started for has passed.

const christmas = (year: number) => new Date(year, 11, 25)

/** The year of the next Christmas still to come (from Boxing Day onwards, next year's). */
export function upcomingChristmasYear(now = new Date()) {
  return now >= new Date(now.getFullYear(), 11, 26) ? now.getFullYear() + 1 : now.getFullYear()
}

export function suggestedSeasonName(now = new Date()) {
  return `Christmas ${upcomingChristmasYear(now)}`
}

/**
 * True when the most recent Christmas came after the season started, i.e.
 * the gifts have (presumably) been given. Lists from before seasons existed
 * have no start date and count as over.
 */
export function isSeasonOver(seasonStartedAt: string | undefined, now = new Date()) {
  const lastChristmas = christmas(upcomingChristmasYear(now) - 1)
  return !seasonStartedAt || new Date(seasonStartedAt) < lastChristmas
}
