import React, { useState } from "react";
import { Navbar } from "src/features/navbar/ui/Navbar";
import { ProductsTable } from "src/features/products/ui/ProductsTable";
import styles from './produtPage.module.css';
import { AddProductForm } from "src/features/productform/ui/productForm";
import { ToastNotification } from "src/shared/toast";

export const ProductPage:React.FC = () => {
    const [formVisible, setFormVisible] = useState(false);
    const [toastIsVisible, setToastVisibility] = useState(false);
    const [product, setProduct] = useState('');
    const [searchMode, setSearchMode] = useState(false);

    const handleChangeProduct = (event: React.ChangeEvent<HTMLInputElement>) => {
        setProduct(event.target.value); 
    }

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {   
          if (product !== '') {
            setSearchMode(true);
          } else {
            setSearchMode(false);    
        }
        }
      };

    const showProductForm = () => {
        setFormVisible(true);
    }

    const hideProductForm = () => {
        setFormVisible(false);
    }

    const handleFormSubmit = () => {
        setFormVisible(false);
        setToastVisibility(true);
        setTimeout(()=>{ 
            setToastVisibility(false);
        }, 5000);
    }

    return (
        <div className={styles.main}>
            <Navbar
                value={product}
                onChange={handleChangeProduct}
                onKeyDown={handleSearchKeyDown}
            />
            <ProductsTable
                searchMode={searchMode}
                searchProduct={product}
                addProductForm={showProductForm}
            />
            
            { formVisible ? 
              <AddProductForm
                onCancel={hideProductForm}
                onSubmit={handleFormSubmit}
              /> 
              : 
              null
            }

            <ToastNotification
                text='Форма успешно добавлена'
                isVisible={toastIsVisible}
            />
        </div>
    )
}