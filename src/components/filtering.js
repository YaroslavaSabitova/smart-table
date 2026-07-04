import { createComparison, defaultRules } from '../lib/compare.js';

// @todo: #4.3 — настроить компаратор
const compare = createComparison([
  'skipNonExistentSourceFields',
  'skipEmptyTargetValues',
  'failOnEmptySource',
  'arrayAsRange',
  'stringIncludes',
  'caseInsensitiveStringIncludes',
  'stringExactMatch',
]);

export function initFiltering(elements, indexes) {
  // @todo: #4.1 — заполнить выпадающие списки опциями/данными
  Object.keys(indexes) // Получаем ключи из объекта
    .forEach(elementName => {
      // Перебираем по именам
      if (elements[elementName]) {
        elements[elementName].append(
          // в каждый элемент добавляем опции
          ...Object.values(indexes[elementName]) // формируем массив имён, значений опций
            .map(name => {
              // используйте name как значение и текстовое содержимое
              // @todo: создать и вернуть тег опции
              const option = document.createElement('option');
              option.value = name;
              option.textContent = name;
              return option;
            })
        );
      }
    });

  function filterData(data, state) {
    const criteria = {};

    // 1. Фильтр по продавцу (из name="seller")
    if (state.seller && state.seller !== 'Все' && state.seller !== '—') {
      criteria.seller = state.seller;
    }

    // 2. Фильтр по дате (из name="date")
    if (state.date && state.date.trim() !== '') {
      criteria.date = state.date.trim();
    }

    // 3. Фильтр по покупателю (из name="customer")
    if (state.customer && state.customer.trim() !== '') {
      criteria.customer = state.customer.trim();
    }

    // 4. Фильтр по сумме (диапазон)
    const totalFrom = state.totalFrom?.trim();
    const totalTo = state.totalTo?.trim();

    if (totalFrom || totalTo) {
      criteria.total = [
        totalFrom ? parseFloat(totalFrom) : null,
        totalTo ? parseFloat(totalTo) : null,
      ];
    }

    return data.filter(row => compare(row, criteria));
  }

  return (data, state, action) => {
    // @todo: #4.2 — обработать очистку поля
    if (action && action.name === 'clear') {
      const parent = action.parentElement;
      const field = parent ? parent.querySelector('input, select') : null;
      if (field) {
        field.value = '';
      }
      const fieldName = action.dataset?.field;
      if (fieldName && state) {
        state[fieldName] = '';
      }
    }

    return filterData(data, state);
  };
}
