import { MAX_CARDS_ON_PAGE } from './constants';

export const getDishListForRender = (arrayForList, currentPage) => {
  const startIndex = (currentPage - 1) * MAX_CARDS_ON_PAGE;
  const endIndex = startIndex + MAX_CARDS_ON_PAGE;
  return arrayForList.slice(startIndex, endIndex);
};

export const getPagesLength = (array) => (Math.ceil(array.length / MAX_CARDS_ON_PAGE) || 1);

export const normolizeCurrentPage = (array, currentPage) => {
  const lastPage = getPagesLength(array);
  return currentPage > lastPage ? lastPage : currentPage || 1;
};