import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { ButtonWithIcon } from 'src/shared/buttons/iconButton';
import { AddButton } from 'src/shared/buttons/addButton';
import { PaginationButton } from 'src/shared/buttons/paginationButton';
import mockButtons from '../../../shared/icons/mock_buttons.svg';
import refresh from '../../../shared/icons/refresh.svg';
import styles from './producttable.module.css';


interface Product {
  id: number;
  title: string;
  brand?: string;
  sku?: string;
  rating?: number;
  price: number;
  stock?: number;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
}

interface SortSettings {
  column: string;
  direction: 'asc' | 'desc';
}

interface Params {
  limit: number;
  skip: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

interface IProps {
  addProductForm?: () => void;
  searchProduct: string;
  searchMode: boolean;
}

// Компонент таблицы
export const ProductsTable: React.FunctionComponent<IProps> = ({addProductForm, searchProduct, searchMode }) => {
  const LIMIT = 5; // выводим не более 5 элементов на страницу
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ currentPage: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Получаем предыдущие настройки сортировки из localStorage
  const savedSortSettings = localStorage.getItem('sortSettings');
  const [sortSettings, setSortSettings] = useState<SortSettings | null>(
    savedSortSettings ? JSON.parse(savedSortSettings) : null
  );

  // Загрузка данных с пагинацией и сортировкой (обычный режим)
  const loadProductsNormal = async () => {
    try {
      const params: Params = {
        limit: LIMIT,
        skip: (pagination.currentPage - 1) * LIMIT,
      };

      if (sortSettings) {
        params.sortBy = sortSettings.column;
        params.order = sortSettings.direction;
      }

      const response = await axios.get('https://dummyjson.com/products', { params });
      const { products: prods, total } = response.data;
      setProducts(prods);
      // пересчитать общее количество страниц
      setPagination((prev) => ({
        ...prev,
        totalPages: Math.ceil(total / LIMIT),
      }));

      //симуляция для прогресс-бара
      let loadedCount = 0;
      const totalItems = products.length;

      const intervalId = setInterval(() => {
        loadedCount++;
        setProgress(Math.round((loadedCount / totalItems * 100)));
          if (loadedCount >= totalItems) {
            clearInterval(intervalId);
            setTimeout(() => {
              setLoading(false);
            }, 3000); // задержка для наглядности эффекта окончания загрузки
          }
        }, 100); // интервал симуляции загрузки (каждый продукт раз в 100мс
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  // Загрузка данных на основе поиска
  const loadProductsSearch = async (term: string, page: number = 1) => {
    try {
      const skip = (page - 1) * LIMIT;
      const res = await axios.get('https://dummyjson.com/products/search', {
        params: { q: term, limit: LIMIT, skip },
      });
      const { products: prods, total } = res.data;
      setProducts(prods);
      setPagination((prev) => ({
        ...prev,
        currentPage: page,
        totalPages: Math.ceil(total / LIMIT),
      }));
    } catch (error) {
      console.error(error);
    }
  };

  // Основной эффект загрузки: подстраиваемся под режим поиска или обычной загрузки
  useEffect(() => {
    if (searchMode && searchProduct.trim()) {
      loadProductsSearch(searchProduct, pagination.currentPage);
    } else {
      loadProductsNormal();
    }
  }, [pagination.currentPage, sortSettings, searchMode, searchProduct]);

  // Обработчик сортировки по столбцу
  const handleSort = (column: string) => {
    if (!sortSettings || sortSettings.column !== column) {
      // Первая сортировка по данному полю (по возрастанию)
      setSortSettings({ column, direction: 'asc' });
    } else {
      // Переключение направления сортировки
      setSortSettings((prev) => ({
        ...prev,
        direction: prev.direction === 'asc' ? 'desc' : 'asc',
      }));
    }
  };

  // Сохранение настроек сортировки в localStorage
  useEffect(() => {
    if (sortSettings) {
      localStorage.setItem('sortSettings', JSON.stringify(sortSettings));
    } else {
      localStorage.removeItem('sortSettings');
    }
  }, [sortSettings]);

  // Расчёт отображаемых страниц - массив (не функция)
  const totalPages = Math.max(1, pagination.totalPages);
  const displayedPages = useMemo<number[]>(() => {
    const halfWindow = 2;
    const windowSize = 2 * halfWindow + 1;
    const start = Math.max(1, pagination.currentPage - halfWindow);
    const end = Math.min(start + windowSize - 1, totalPages);
    const arr: number[] = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  }, [totalPages, pagination.currentPage]);

  // Обработчик смены страницы
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setPagination((prev) => ({
        ...prev,
        currentPage: page,
      }));
    }
  };

  useEffect(()=>{
    if(searchMode) {
      setPagination({ currentPage: 1, totalPages: 1 });
    }
    else {
      setPagination({ currentPage: 1, totalPages: 1 });
    }
  }, [searchMode]);
  
  return ( 
    <div>
      {loading ? 
        <div className={styles.progress_bar}>
          <div><span>Загрузка...</span></div> 
          <div>
            <progress max="100" value={progress}>{progress}%</progress>
          </div>
        </div>
      : ( 
      <div className={styles.main}>
        <div className={styles.title_container}>
          <div className={styles.title}>
            <span>Все позиции</span>
          </div> 
          <div className={styles.refresh}>
            <ButtonWithIcon iconSrc={refresh}/>
          </div>
          <div className={styles.add}>
            <AddButton
              onClick={addProductForm}
            />
          </div>
        </div>

        <table className={styles.table}>
          <thead className={styles.table_head}>
            <tr>
              <th className={styles.table_check}>
                <input type="checkbox"/>
              </th>
              <th className={styles.table_head_line_left}
                onClick={() => handleSort('title')}
                style={{
                  cursor: 'pointer',
                  fontWeight: sortSettings?.column === 'title' ? 'bold' : '',
                }}
              >
                Наименование
                {sortSettings?.column === 'title' && (
                  <span>
                    {sortSettings.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th
                className={styles.table_head_line}
                onClick={() => handleSort('brand')}
                style={{
                  cursor: 'pointer',
                  fontWeight: sortSettings?.column === 'brand' ? 'bold' : '',
                }}
              >
                Вендор
                {sortSettings?.column === 'brand' && (
                  <span>
                    {sortSettings.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th
                className={styles.table_head_line}
                onClick={() => handleSort('sku')}
                style={{
                  cursor: 'pointer',
                  fontWeight: sortSettings?.column === 'sku' ? 'bold' : '',
                }}
              >
                Артикул
                {sortSettings?.column === 'sku' && (
                  <span>
                    {sortSettings.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th
                className={styles.table_head_line}
                onClick={() => handleSort('rating')}
                style={{
                  cursor: 'pointer',
                  fontWeight: sortSettings?.column === 'rating' ? 'bold' : '',
                }}
              >
                Оценка
                {sortSettings?.column === 'rating' && (
                  <span>
                    {sortSettings.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th
                className={styles.table_head_line}
                onClick={() => handleSort('price')}
                style={{
                  cursor: 'pointer',
                  fontWeight: sortSettings?.column === 'price' ? 'bold' : '',
                }}
              >
                Цена
                {sortSettings?.column === 'price' && (
                  <span>
                    {sortSettings.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th
                className={styles.table_head_line}
                onClick={() => handleSort('stock')}
                style={{
                  cursor: 'pointer',
                  fontWeight: sortSettings?.column === 'stock' ? 'bold' : '',
                }}
              >
                Количество
                {sortSettings?.column === 'stock' && (
                  <span>
                    {sortSettings.direction === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th  className={styles.table_head_line}></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                className={styles.table_row} 
                key={product.id}
              >
                <td className={styles.table_check && styles.table_row_line}>
                  <input type="checkbox"/>
                </td>
                <td className={styles.table_row_line_left}>{product.title}</td>
                <td className={styles.table_row_line}>{product.brand ?? '-'}</td>
                <td className={styles.table_row_line}>{product.sku ?? '-'}</td>
                <td className={styles.table_row_line}>
                  {product.rating != null ? `${product.rating}/5` : '-'}
                </td>
                <td className={styles.table_row_line}>{product.price.toFixed(2)} ₽</td>
                <td className={styles.table_row_line}>{product.stock != null ? product.stock : '-'}</td>
                <td className={styles.table_row_line}>
                  <div className={styles.table_mock_buttons}>
                    <img src={mockButtons} alt=""/>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Контроллеры пагинации */}
        <div className={styles.pagination_container}>
          <PaginationButton
            buttonType='FIRST'
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          />  
          {displayedPages.map((page) => (            
            <PaginationButton
              buttonType='PAGE'
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={pagination.currentPage === page}
              label={String(page)}
            />
          ))}
          <PaginationButton 
            buttonType='LAST'
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
          />
        </div>  
      </div>
      )}
    </div>
  );
};
