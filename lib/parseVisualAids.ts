interface VisualAidData {
  type: string;
  patientValue: number;
  normalMin: number;
  normalMax: number;
  testName: string;
  unit: string;
  thresholds?: {
    label: string;
    value: number;
    color: string;
  }[];
  caption?: string;
  rawText: string;
}

export function parseVisualAidsFromText(text: string): VisualAidData[] {
  const visualAids: VisualAidData[] = [];
  
  // Split by test sections (### 🔹)
  const testSections = text.split('### 🔹').slice(1); // Skip first empty split
  
  for (const section of testSections) {
    try {
      // Extract test name and value from heading
      const headingMatch = section.match(/^(.+?):\s*(.+?)(?:\n|$)/);
      if (!headingMatch) continue;
      
      const testName = headingMatch[1].trim();
      const valueWithUnit = headingMatch[2].trim();
      
      // Extract patient value and unit
      const valueMatch = valueWithUnit.match(/([\d.]+)\s*([a-zA-Z/%]+)/);
      if (!valueMatch) continue;
      
      const patientValue = parseFloat(valueMatch[1]);
      const unit = valueMatch[2];
      
      // Extract normal range
      const normalRangeMatch = section.match(/\*\*Normal range:\*\*\s*[\n]?(.+?)(?:\n|$)/i);
      if (!normalRangeMatch) continue;
      
      const rangeText = normalRangeMatch[1].trim();
      const rangeMatch = rangeText.match(/([\d.]+)\s*[-–]\s*([\d.]+)/);
      if (!rangeMatch) continue;
      
      const normalMin = parseFloat(rangeMatch[1]);
      const normalMax = parseFloat(rangeMatch[2]);
      
      // Extract visual aid section
      const visualAidMatch = section.match(/### 📊 Visual Aid Instruction([\s\S]+?)(?=###|$)/);
      if (!visualAidMatch) continue;
      
      const visualAidText = visualAidMatch[1];
      
      // Extract type
      const typeMatch = visualAidText.match(/[-•]\s*\*\*Type:\*\*\s*(.+?)(?:\n|$)/i);
      const type = typeMatch ? typeMatch[1].trim().replace(/["\[\]]/g, '') : 'bar chart';
      
      // Extract caption
      const captionMatch = visualAidText.match(/[-•]\s*\*\*Caption:\*\*\s*(.+?)(?:\n|$)/i);
      const caption = captionMatch ? captionMatch[1].trim().replace(/["\[\]]/g, '') : undefined;
      
      // Extract thresholds if present
      const thresholdsMatch = visualAidText.match(/[-•]\s*\*\*Thresholds:\*\*\s*(.+?)(?:\n|$)/i);
      let thresholds: { label: string; value: number; color: string }[] | undefined;
      
      if (thresholdsMatch) {
        const thresholdText = thresholdsMatch[1];
        const thresholdParts = thresholdText.split('|');
        thresholds = thresholdParts.map(part => {
          const match = part.match(/(.+?):\s*([\d.]+)(?:-[\d.]+)?/);
          if (match) {
            return {
              label: match[1].trim(),
              value: parseFloat(match[2]),
              color: part.toLowerCase().includes('normal') ? '#22c55e' : 
                     part.toLowerCase().includes('borderline') ? '#eab308' : '#ef4444'
            };
          }
          return null;
        }).filter(Boolean) as { label: string; value: number; color: string }[];
      }
      
      visualAids.push({
        type,
        patientValue,
        normalMin,
        normalMax,
        testName,
        unit,
        thresholds,
        caption,
        rawText: visualAidText
      });
      
    } catch (error) {
      console.warn('Failed to parse visual aid section:', error);
      continue;
    }
  }
  
  return visualAids;
}
