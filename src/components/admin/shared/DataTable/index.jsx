import { Button } from "@/components/ui/button";
import LoadingSpot from "@/components/ui/spinner/loadingSpiner";
import { useNavigate } from "react-router-dom";

const DataTable = ({
  title,
  subtitle,
  columns,
  rows = [],
  loading = false,
  navigateData,
  className,
  padding
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      {/* Header */}
      <div className={`flex justify-between px-6 ${padding || "py-4"} border-b`}>
        {title && (
          <div className="flex justify-between ">
            <div>
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="text-sm text-slate-500">{subtitle}</p>
            </div>
          </div>
        )}
        {navigateData && (
          <Button onClick={() => navigate(navigateData)}>View All</Button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl">
        <table className="w-full text-sm">
          <thead className={className || "bg-slate-50 text-slate-500"}>
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="px-6 py-3 text-left font-semibold">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y">
            {/* Loading */}
            {loading && (
              <tr>
                <td colSpan={columns.length} className="py-6 text-center">
                  <LoadingSpot text="Loading data" />
                </td>
              </tr>
            )}

            {/* Empty */}
            {!loading && rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-6 text-center text-slate-500"
                >
                  No data found
                </td>
              </tr>
            )}

            {/* Rows */}
            {!loading &&
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  {columns.map((col, index) => (
                    <td key={index} className="px-6 py-4">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
