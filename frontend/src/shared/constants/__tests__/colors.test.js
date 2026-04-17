import { describe, it, expect } from 'vitest';
import {
  CHART_COLORS,
  PRIORITY_CLASSES,
  TASK_STATUS_COLORS,
  PRIORITY_CHART_COLORS,
  COURSE_DEFAULT_COLOR,
  EVENT_TYPE_COLORS,
} from '../colors.js';

describe('colors.js — constantes de diseño', () => {
  describe('CHART_COLORS', () => {
    it('contiene los 8 colores esperados', () => {
      expect(CHART_COLORS).toMatchObject({
        primary: expect.any(String),
        success: expect.any(String),
        warning: expect.any(String),
        danger: expect.any(String),
        purple: expect.any(String),
        muted: expect.any(String),
        border: expect.any(String),
        tooltipBg: expect.any(String),
      });
    });

    it('todos los valores hexadecimales son válidos', () => {
      const hexPattern = /^#[0-9a-fA-F]{3,6}$/;
      const hexColors = ['primary', 'success', 'warning', 'danger', 'purple', 'muted', 'border'];
      hexColors.forEach((key) => {
        expect(CHART_COLORS[key]).toMatch(hexPattern);
      });
    });

    it('primary es azul (#3b82f6)', () => {
      expect(CHART_COLORS.primary).toBe('#3b82f6');
    });

    it('danger es rojo (#ef4444)', () => {
      expect(CHART_COLORS.danger).toBe('#ef4444');
    });

    it('success es verde (#22c55e)', () => {
      expect(CHART_COLORS.success).toBe('#22c55e');
    });
  });

  describe('PRIORITY_CLASSES', () => {
    it('tiene clases para Alta, Media y Baja', () => {
      expect(PRIORITY_CLASSES).toHaveProperty('Alta');
      expect(PRIORITY_CLASSES).toHaveProperty('Media');
      expect(PRIORITY_CLASSES).toHaveProperty('Baja');
    });

    it('cada clase es un string no vacío', () => {
      Object.values(PRIORITY_CLASSES).forEach((cls) => {
        expect(typeof cls).toBe('string');
        expect(cls.length).toBeGreaterThan(0);
      });
    });

    it('Alta incluye color rojo', () => {
      expect(PRIORITY_CLASSES.Alta).toContain('red');
    });

    it('Media incluye color amber', () => {
      expect(PRIORITY_CLASSES.Media).toContain('amber');
    });
  });

  describe('TASK_STATUS_COLORS', () => {
    it('tiene colores para completed, pending y expired', () => {
      expect(TASK_STATUS_COLORS).toHaveProperty('completed');
      expect(TASK_STATUS_COLORS).toHaveProperty('pending');
      expect(TASK_STATUS_COLORS).toHaveProperty('expired');
    });

    it('completed usa el color success de CHART_COLORS', () => {
      expect(TASK_STATUS_COLORS.completed).toBe(CHART_COLORS.success);
    });

    it('expired usa el color danger de CHART_COLORS', () => {
      expect(TASK_STATUS_COLORS.expired).toBe(CHART_COLORS.danger);
    });

    it('pending usa el color warning de CHART_COLORS', () => {
      expect(TASK_STATUS_COLORS.pending).toBe(CHART_COLORS.warning);
    });
  });

  describe('PRIORITY_CHART_COLORS', () => {
    it('mapea Alta a danger (rojo)', () => {
      expect(PRIORITY_CHART_COLORS.Alta).toBe(CHART_COLORS.danger);
    });

    it('mapea Media a warning (amber)', () => {
      expect(PRIORITY_CHART_COLORS.Media).toBe(CHART_COLORS.warning);
    });

    it('mapea Baja a success (verde)', () => {
      expect(PRIORITY_CHART_COLORS.Baja).toBe(CHART_COLORS.success);
    });
  });

  describe('COURSE_DEFAULT_COLOR', () => {
    it('es igual al primary de CHART_COLORS', () => {
      expect(COURSE_DEFAULT_COLOR).toBe(CHART_COLORS.primary);
    });

    it('es un hex válido', () => {
      expect(COURSE_DEFAULT_COLOR).toMatch(/^#[0-9a-fA-F]{3,6}$/);
    });
  });

  describe('EVENT_TYPE_COLORS', () => {
    const expectedTypes = ['default', 'exam', 'assignment', 'reminder'];

    it.each(expectedTypes)('tiene la clave "%s"', (type) => {
      expect(EVENT_TYPE_COLORS).toHaveProperty(type);
    });

    it.each(expectedTypes)('"%s" tiene propiedades bg, hover y text', (type) => {
      expect(EVENT_TYPE_COLORS[type]).toHaveProperty('bg');
      expect(EVENT_TYPE_COLORS[type]).toHaveProperty('hover');
      expect(EVENT_TYPE_COLORS[type]).toHaveProperty('text');
    });

    it.each(expectedTypes)('las propiedades de "%s" son strings no vacíos', (type) => {
      const { bg, hover, text } = EVENT_TYPE_COLORS[type];
      [bg, hover, text].forEach((val) => {
        expect(typeof val).toBe('string');
        expect(val.length).toBeGreaterThan(0);
      });
    });
  });
});
