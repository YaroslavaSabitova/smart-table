import { cloneTemplate } from '../lib/utils.js';

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);

  // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы

  if (before) {
    before.reverse().forEach(subName => {
      // перебираем нужный массив идентификаторов
      root[subName] = cloneTemplate(subName); // клонируем и получаем объект, сохраняем в таблице
      root.container.prepend(root[subName].container); // добавляем к таблице после (append) или до (prepend)
    });
  }

  if (after) {
    after.forEach(subName => {
      // перебираем нужный массив идентификаторов
      root[subName] = cloneTemplate(subName); // клонируем и получаем объект, сохраняем в таблице
      root.container.append(root[subName].container); // добавляем к таблице после (append) или до (prepend)
    });
  }

  // @todo: #1.3 —  обработать события и вызвать onAction()
  root.container.addEventListener('change', () => {
    onAction();
  });

  root.container.addEventListener('reset', () => {
    setTimeout(() => {
      onAction();
    });
  });

  root.container.addEventListener('submit', e => {
    e.preventDefault();
    onAction(e.submitter);
  });

  const render = data => {
    // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate

    //   берём новый массив data из data.js;
    const nextRows = data.map(item => {
      // клонированный шаблон строки
      const row = cloneTemplate(rowTemplate);

      //   console.log('data', data);
      //   console.log('row', row);

      // Трансформируем данные в строки и выводим их
      Object.keys(item).forEach(key => {
        if (key in row.elements) {
          row.elements[key].textContent = item[key];
        }
      });

      //   console.log('row2', row);
      return row.container;
    });

    root.elements.rows.replaceChildren(...nextRows);
  };

  return { ...root, render };
}
