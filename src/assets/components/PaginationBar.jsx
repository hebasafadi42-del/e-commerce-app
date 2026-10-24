import { Form, Button, ButtonGroup } from "react-bootstrap";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

const PaginationBar = ({
  page,
  totalPages,
  perPage,
  onPageChange,
  onPerPageChange,
  perPageOptions = [5, 10, 20],
}) => {
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  const btnStyle = { backgroundColor: "#fff", borderColor: "#DEE2E6", color: "#212529" };

  return (
    <div className="d-flex justify-content-end align-items-center gap-3 my-4">
      <Form.Select
        value={perPage}
        onChange={(e) => onPerPageChange(Number(e.target.value))}
        className="shadow-none w-auto"
        style={{ borderColor: "#DEE2E6" }}
      >
        {perPageOptions.map((n) => (
          <option key={n} value={n}>
            Show {n}
          </option>
        ))}
      </Form.Select>

      <ButtonGroup>
        <Button
          variant="light"
          style={btnStyle}
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          <BiChevronLeft size={20} />
        </Button>

        {pages.map((p) => (
          <Button
            key={p}
            variant="light"
            style={{
              ...btnStyle,
              backgroundColor: p === page ? "#EFF2F4" : "#fff",
              fontWeight: p === page ? "500" : "normal",
            }}
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        ))}

        <Button
          variant="light"
          style={btnStyle}
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <BiChevronRight size={20} />
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default PaginationBar;