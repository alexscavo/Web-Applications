import { ListGroup } from "react-bootstrap";
import { useState } from 'react';

function FilterList(props) {

    const [activeFilter, setActiveFilter] = useState('All');

    const handleFilterSelection = (filter) => {
        
        setActiveFilter(filter);
        props.selectFilter(filter);
    }
  
    return(
    <ListGroup as="ul" id='left-list-group'>
      <ListGroup.Item className='list-group-item' as="li" onClick={() => handleFilterSelection('All')} active={activeFilter === 'All'}>All</ListGroup.Item>
      <ListGroup.Item className='list-group-item' as="li" onClick={() => handleFilterSelection('Favourites')} active={activeFilter === 'Favourites'}>Favourites</ListGroup.Item>
      <ListGroup.Item className='list-group-item' as="li" onClick={() => handleFilterSelection('Best Rated')} active={activeFilter === 'Best Rated'}>Best Rated</ListGroup.Item>
      <ListGroup.Item className='list-group-item' as="li" onClick={() => handleFilterSelection('Seen Last Month')} active={activeFilter === 'Seen Last Month'}>Seen Last Month</ListGroup.Item>
      <ListGroup.Item className='list-group-item' as="li" onClick={() => handleFilterSelection('Unseen')} active={activeFilter === 'Unseen'}>Unseen</ListGroup.Item>
    </ListGroup>
    );
}

export default FilterList;