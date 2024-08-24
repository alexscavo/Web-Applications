import { useState } from "react";
import { ListGroup } from "react-bootstrap";

function SideBar(props) {

    const [activeFilter, setActiveFilter] = useState('all');

    const handleFilterAction = (filter) => {
        setActiveFilter(filter);
    }

    return (
      <ListGroup as='ul' id='list-group' >
        <ListGroup.Item className='list-group-item' as='li' onClick={()=> handleFilterAction('all')}active={activeFilter === 'all'}>All</ListGroup.Item>
        <ListGroup.Item className='list-group-item' as='li' onClick={()=> handleFilterAction('favourites')}active={activeFilter === 'favourites'}>Favourites</ListGroup.Item>
        <ListGroup.Item className='list-group-item' as='li' onClick={()=> handleFilterAction('best-rated')}active={activeFilter === 'best-rated'}>Best Rated</ListGroup.Item>
        <ListGroup.Item className='list-group-item' as='li' onClick={()=> handleFilterAction('seen-last-month')}active={activeFilter === 'seen-last-month'}>Seen Last Month</ListGroup.Item>
        <ListGroup.Item className='list-group-item' as='li' onClick={()=> handleFilterAction('unseen')}active={activeFilter === 'unseen'}>Unseen</ListGroup.Item>
      </ListGroup>
    );
}

export default SideBar;