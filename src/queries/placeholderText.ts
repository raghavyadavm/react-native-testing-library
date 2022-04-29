import type { ReactTestInstance } from 'react-test-renderer';
import {
  createLibraryNotSupportedError,
  throwRenamedFunctionError,
} from '../helpers/errors';
import { filterNodeByType } from '../helpers/filterNodeByType';
import { matches, TextMatch } from '../matches';
import { makeQueries } from './makeQueries';
import type {
  FindAllByQuery,
  FindByQuery,
  GetAllByQuery,
  GetByQuery,
  QueryAllByQuery,
  QueryByQuery,
} from './makeQueries';
import type { TextMatchOptions } from './text';

const getTextInputNodeByPlaceholderText = (
  node: ReactTestInstance,
  placeholder: TextMatch,
  options: TextMatchOptions = {}
) => {
  try {
    const { TextInput } = require('react-native');
    const { exact, normalizer } = options;
    return (
      filterNodeByType(node, TextInput) &&
      matches(placeholder, node.props.placeholder, normalizer, exact)
    );
  } catch (error) {
    throw createLibraryNotSupportedError(error);
  }
};

const queryAllByPlaceholderText = (
  instance: ReactTestInstance
): ((
  placeholder: TextMatch,
  queryOptions?: TextMatchOptions
) => Array<ReactTestInstance>) =>
  function queryAllByPlaceholderFn(placeholder, queryOptions) {
    return instance.findAll((node) =>
      getTextInputNodeByPlaceholderText(node, placeholder, queryOptions)
    );
  };

const getMultipleError = (placeholder: TextMatch) =>
  `Found multiple elements with placeholder: ${String(placeholder)} `;
const getMissingError = (placeholder: TextMatch) =>
  `Unable to find an element with placeholder: ${String(placeholder)}`;

const { getBy, getAllBy, queryBy, findBy, findAllBy } = makeQueries(
  queryAllByPlaceholderText,
  getMissingError,
  getMultipleError
);

export type ByPlaceholderTextQueries = {
  getByPlaceholderText: GetByQuery<TextMatch, TextMatchOptions>;
  getAllByPlaceholderText: GetAllByQuery<TextMatch, TextMatchOptions>;
  queryByPlaceholderText: QueryByQuery<TextMatch, TextMatchOptions>;
  queryAllByPlaceholderText: QueryAllByQuery<TextMatch, TextMatchOptions>;
  findByPlaceholderText: FindByQuery<TextMatch, TextMatchOptions>;
  findAllByPlaceholderText: FindAllByQuery<TextMatch, TextMatchOptions>;

  // Renamed
  getByPlaceholder: () => void;
  getAllByPlaceholder: () => void;
  queryByPlaceholder: () => void;
  queryAllByPlaceholder: () => void;
  findByPlaceholder: () => void;
  findAllByPlaceholder: () => void;
};

export const bindByPlaceholderTextQueries = (
  instance: ReactTestInstance
): ByPlaceholderTextQueries => ({
  getByPlaceholderText: getBy(instance),
  getAllByPlaceholderText: getAllBy(instance),
  queryByPlaceholderText: queryBy(instance),
  queryAllByPlaceholderText: queryAllByPlaceholderText(instance),
  findByPlaceholderText: findBy(instance),
  findAllByPlaceholderText: findAllBy(instance),

  // Renamed
  getByPlaceholder: () =>
    throwRenamedFunctionError('getByPlaceholder', 'getByPlaceholderText'),
  getAllByPlaceholder: () =>
    throwRenamedFunctionError('getAllByPlaceholder', 'getAllByPlaceholderText'),
  queryByPlaceholder: () =>
    throwRenamedFunctionError('queryByPlaceholder', 'queryByPlaceholderText'),
  queryAllByPlaceholder: () =>
    throwRenamedFunctionError(
      'queryAllByPlaceholder',
      'queryAllByPlaceholderText'
    ),
  findByPlaceholder: () =>
    throwRenamedFunctionError('findByPlaceholder', 'findByPlaceholderText'),
  findAllByPlaceholder: () =>
    throwRenamedFunctionError(
      'findAllByPlaceholder',
      'findAllByPlaceholderText'
    ),
});