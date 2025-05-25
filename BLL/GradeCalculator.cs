using System;
using System.Collections.Generic;
using System.Linq;

namespace BLL
{
    public class GradeCalculator
    {
        private const double FIRST_CUT_WEIGHT = 0.30;
        private const double SECOND_CUT_WEIGHT = 0.30;
        private const double THIRD_CUT_WEIGHT = 0.40;
        private const double PASSING_GRADE = 3.0;

        public double CalculateFinalGrade(double firstCut, double secondCut, double thirdCut)
        {
            return (firstCut * FIRST_CUT_WEIGHT) +
                   (secondCut * SECOND_CUT_WEIGHT) +
                   (thirdCut * THIRD_CUT_WEIGHT);
        }

        public double CalculateRequiredGrade(double firstCut, double secondCut)
        {
            double currentGrade = (firstCut * FIRST_CUT_WEIGHT) + (secondCut * SECOND_CUT_WEIGHT);
            double requiredPoints = PASSING_GRADE - currentGrade;
            return requiredPoints / THIRD_CUT_WEIGHT;
        }

        public double CalculateSemesterAverage(List<SubjectGrade> subjects)
        {
            if (subjects == null || !subjects.Any())
                return 0;

            double totalWeightedGrade = 0;
            int totalCredits = 0;

            foreach (var subject in subjects)
            {
                totalWeightedGrade += subject.Grade * subject.Credits;
                totalCredits += subject.Credits;
            }

            return totalCredits > 0 ? totalWeightedGrade / totalCredits : 0;
        }

        public double CalculateAccumulatedAverage(List<SubjectGrade> allSubjects)
        {
            if (allSubjects == null || !allSubjects.Any())
                return 0;

            // Agrupar por código de materia y tomar la última nota
            var latestGrades = allSubjects
                .GroupBy(s => s.SubjectCode)
                .Select(g => g.OrderByDescending(s => s.Semester).First())
                .ToList();

            return CalculateSemesterAverage(latestGrades);
        }
    }

    public class SubjectGrade
    {
        public string SubjectCode { get; set; }
        public string SubjectName { get; set; }
        public int Credits { get; set; }
        public double Grade { get; set; }
        public int Semester { get; set; }
    }
} 