import { ListGroup } from "react-bootstrap";

function FilterList() {
    return(
    <ListGroup as="ul" id='left-list-group'>
      <ListGroup.Item as="li" active>All</ListGroup.Item>
      <ListGroup.Item as="li">Favourites</ListGroup.Item>
      <ListGroup.Item as="li">Best Rated</ListGroup.Item>
      <ListGroup.Item as="li">Seen Last Month</ListGroup.Item>
      <ListGroup.Item as="li">Unseen</ListGroup.Item>
    </ListGroup>
    );
}

export default FilterList;