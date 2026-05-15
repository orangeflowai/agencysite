/**
 * jsonTours.ts - Server-only JSON tour loader
 * This file should only be imported in server components
 */

import fs from 'fs'
import path from 'path'

export function loadToursFromJSON() {
  const tours = []
  
  try {
    const tour1Path = path.join(process.cwd(), 'tour-data-tour1.json')
    const tour2Path = path.join(process.cwd(), 'tour-data-tour2.json')
    
    if (fs.existsSync(tour1Path)) {
      const tour1Data = JSON.parse(fs.readFileSync(tour1Path, 'utf8'))
      tours.push(tour1Data)
    }
    
    if (fs.existsSync(tour2Path)) {
      const tour2Data = JSON.parse(fs.readFileSync(tour2Path, 'utf8'))
      tours.push(tour2Data)
    }
    
    console.log(`[jsonTours] Loaded ${tours.length} tours from JSON files`)
  } catch (error) {
    console.error('[jsonTours] Error loading JSON tours:', error)
  }
  
  return tours
}

export function loadTourFromJSON(slug: string) {
  try {
    const tour1Path = path.join(process.cwd(), 'tour-data-tour1.json')
    const tour2Path = path.join(process.cwd(), 'tour-data-tour2.json')
    
    if (fs.existsSync(tour1Path)) {
      const tour1Data = JSON.parse(fs.readFileSync(tour1Path, 'utf8'))
      if (tour1Data.slug === slug) {
        return tour1Data
      }
    }
    
    if (fs.existsSync(tour2Path)) {
      const tour2Data = JSON.parse(fs.readFileSync(tour2Path, 'utf8'))
      if (tour2Data.slug === slug) {
        return tour2Data
      }
    }
  } catch (error) {
    console.error('[jsonTours] Error loading JSON tour:', error)
  }
  
  return null
}
