import React, { useState, useMemo } from 'react';
import { FaEye, FaEdit, FaTrash, FaTh, FaList } from 'react-icons/fa';

const CustomDataTable = ({
  data=[],
  fields=[],
  Search_Input,
  onEdit,
  onDelete,
  onView,
  title,
  itemsPerPage = 5,
  pagination = true,
  width = '100%',
  height = 'auto',
  style = {},
  scrollable = true,
  onRowPress,
  emptyMessage = "No data available",
  loading = false,
  selectionMode = false,
  selectedItems = [],
  onSelectItem,
  showSearch = false,
  searchPlaceholder = "Search...",
  onSearchChange,
  defaultView = 'table',
  showViewToggle = true,
  cardViewRender
}) => {
  const [page, setPage] = useState(0);
  const [itemsPerPageState, setItemsPerPage] = useState(itemsPerPage);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState(defaultView);

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    return data.filter(item =>
      fields.some(field =>
        item[field.key]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [data, searchQuery, fields]);

  const from = page * itemsPerPageState;
  const to = Math.min((page + 1) * itemsPerPageState, filteredData.length);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange?.(query);
    setPage(0);
  };

  const renderActionButtons = (row) => (
    <div className="flex gap-2 justify-end">
      {onView && (
        <button onClick={() => onView(row)} className="p-2 bg-blue-100 rounded-md hover:bg-blue-200">
          <FaEye className="text-blue-700" />
        </button>
      )}
      {onEdit && (
        <button onClick={() => onEdit(row)} className="p-2 bg-indigo-100 rounded-md hover:bg-indigo-200">
          <FaEdit className="text-indigo-700" />
        </button>
      )}
      {onDelete && (
        <button onClick={() => onDelete(row)} className="p-2 bg-red-100 rounded-md hover:bg-red-200">
          <FaTrash className="text-red-700" />
        </button>
      )}
    </div>
  );

  const defaultCardRender = (item, index) => (
    <div
      key={index}
      className={`border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition-all ${
        selectionMode && selectedItems.includes(index) ? 'bg-blue-50 border-blue-300' : ''
      }`}
    >
      {fields.map((field, i) => (
        <div key={i} className="flex justify-between py-1">
          <span className="font-semibold text-gray-600">{field.label}:</span>
          <span className="text-gray-800">{item[field.key]}</span>
        </div>
      ))}
      {(onView || onEdit || onDelete) && (
        <div className="border-t mt-3 pt-2">{renderActionButtons(item)}</div>
      )}
    </div>
  );

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left border">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            {selectionMode && <th className="p-2 w-10">Select</th>}
            {fields.map((field, i) => (
              <th key={i} className="p-2 font-semibold">{field.label}</th>
            ))}
            {(onView || onEdit || onDelete) && <th className="p-2 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={fields.length + 1} className="text-center p-5">
                Loading...
              </td>
            </tr>
          ) : filteredData.length === 0 ? (
            <tr>
              <td colSpan={fields.length + 1} className="text-center p-5 text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            filteredData.slice(from, to).map((row, i) => (
              <tr
                key={i}
                className={`border-b hover:bg-gray-50 ${
                  selectionMode && selectedItems.includes(i) ? 'bg-blue-50' : ''
                }`}
                onClick={() => onRowPress?.(row)}
              >
                {selectionMode && (
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(i)}
                      onChange={() => onSelectItem?.(i)}
                    />
                  </td>
                )}
                {fields.map((field, j) => (
                  <td key={j} className="p-2">
                    {field.render ? field.render(row[field.key], row) : row[field.key]}
                  </td>
                ))}
                {(onView || onEdit || onDelete) && (
                  <td className="p-2 text-right">{renderActionButtons(row)}</td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {pagination && filteredData.length > itemsPerPageState && (
        <div className="flex justify-between items-center p-3 text-sm text-gray-600 bg-gray-50">
          <span>
            {from + 1}-{to} of {filteredData.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>
            <button
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              disabled={to >= filteredData.length}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderCardView = () => (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {filteredData.slice(from, to).map((item, i) =>
        cardViewRender ? cardViewRender(item, i) : defaultCardRender(item, i)
      )}
    </div>
  );

  return (
    <div className="border rounded-lg shadow bg-white overflow-hidden" style={{ width, height, ...style }}>
      <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

        {showViewToggle && (
          <div className="flex gap-2">
            <button
              className={`p-2 rounded-md ${currentView === 'table' ? 'bg-blue-100' : ''}`}
              onClick={() => setCurrentView('table')}
            >
              <FaTh />
            </button>
            <button
              className={`p-2 rounded-md ${currentView === 'card' ? 'bg-blue-100' : ''}`}
              onClick={() => setCurrentView('card')}
            >
              <FaList />
            </button>
          </div>
        )}
      </div>

      {showSearch && (
        <div className="p-3 flex gap-3 items-center border-b">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={handleSearchChange}
            className="border rounded px-3 py-2 flex-1 text-sm"
          />
          {Search_Input}
        </div>
      )}

      <div>{currentView === 'table' ? renderTableView() : renderCardView()}</div>

      {selectionMode && selectedItems.length > 0 && (
        <div className="p-3 bg-blue-50 text-blue-800 text-sm text-center border-t">
          {selectedItems.length} item(s) selected
        </div>
      )}
    </div>
  );
};

export default CustomDataTable;
