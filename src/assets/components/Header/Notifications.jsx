import { useContext } from "react";
import { Dropdown, Badge, Spinner } from "react-bootstrap";
import {MdNotifications
} from "react-icons/md";
import useNotifications from "../../Hooks/useNotifications";
import { AuthContext } from "../../Contexts/AuthContext";
const Notifications = () => {

   const { token } = useContext(AuthContext);
  const { notifications, loading, error } = useNotifications();

    if (!token) return null;
  return (
    <>
        <Dropdown align="center">
      <Dropdown.Toggle
        variant="transparent"
        bsPrefix="p-0  border-0 bg-transparentposition-relative  "
        id="notifications-dropdown"
      >
        <MdNotifications className="fs-3  text-muted"  />
        {notifications.length > 0 && (
          <Badge
            pill
            bg="danger"
            className="position-absolute top-0 start-100 translate-middle"
            style={{ fontSize: "0.65rem" }}
          >
            {notifications.length}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ minWidth: "280px", maxHeight: "350px", overflowY: "auto" }}>
        <Dropdown.Header>Notifications</Dropdown.Header>

        {loading && (
          <div className="text-center p-3">
            <Spinner animation="border" size="sm" variant="danger" />
          </div>
        )}

        {!loading && error && (
          <Dropdown.ItemText className="text-danger small">{error}</Dropdown.ItemText>
        )}

        {!loading && !error && notifications.length === 0 && (
          <Dropdown.ItemText className="text-muted small">
            No notifications yet.
          </Dropdown.ItemText>
        )}

        {!loading &&
          !error &&
          notifications.map((n) => (
            <Dropdown.ItemText key={n.id} className="border-bottom small">
              {n.title ?? n.message}
            </Dropdown.ItemText>
          ))}
      </Dropdown.Menu>
    </Dropdown>
    </>
  )
}

export default Notifications
