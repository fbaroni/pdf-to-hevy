#!/usr/bin/env python3
"""Generate a sample workout PDF for testing."""

from fpdf import FPDF
import os

def create_workout_pdf(output_path: str):
    pdf = FPDF()
    pdf.add_page()
    
    # Title
    pdf.set_font('Helvetica', 'B', 16)
    pdf.cell(0, 10, 'Mi Rutina de Fuerza', ln=True, align='C')
    pdf.ln(10)
    
    # Exercises
    pdf.set_font('Helvetica', '', 12)
    exercises = [
        '1. Bench Press - 4x10 @ 60kg',
        '2. Squat - 4x8 @ 80kg',
        '3. Deadlift - 3x5 @ 100kg',
        '4. Shoulder Press - 3x12 @ 30kg',
        '5. Barbell Row - 4x10 @ 50kg'
    ]
    
    for ex in exercises:
        pdf.cell(0, 10, ex, ln=True)
    
    pdf.output(output_path)
    print(f'PDF creado: {output_path}')

if __name__ == '__main__':
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.dirname(script_dir)
    output_path = os.path.join(project_dir, 'examples', 'test-workout.pdf')
    
    # Ensure examples directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    create_workout_pdf(output_path)
