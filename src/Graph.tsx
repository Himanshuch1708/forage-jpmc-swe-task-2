import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';

/**
 * Props declaration for <Graph />
 */
interface IProps {
  data: ServerRespond[],
}

/**
 * Perspective library adds load to HTMLElement prototype.
 * This interface acts as a wrapper for Typescript compiler.
 */
interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}

/**
 * React component that renders Perspective based on data
 * parsed from its parent through data property.
 */
class Graph extends Component<IProps, {}> {
  // Perspective table
  table: Table | undefined;

  render() {
    return <perspective-viewer view='y_line' row-pivots={['timestamp']} column-pivots={['stock']} columns={['top_ask_price']} aggregates={{'stock': 'distinct count', 'top_ask_price': 'avg', 'top_bid_price': 'avg', 'timestamp': 'distinct count'}}></perspective-viewer>;
  }

  componentDidMount() {
    // Get element to attach the table from the DOM.
    const elem: PerspectiveViewerElement | null = document.getElementsByTagName('perspective-viewer')[0];

    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table && elem) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
    }
  }

  componentDidUpdate(prevProps: IProps) {
    // Everytime the data props is updated, insert the data into Perspective table
    if (this.table && prevProps.data !== this.props.data) {
      // As part of the task, you need to fix the way we update the data props to
      // avoid inserting duplicated entries into Perspective table again.
      this.table.update(this.props.data.map((el: ServerRespond) => {
        // Format the data from ServerRespond to the schema
        return {
          stock: el.stock,
          top_ask_price: el.top_ask && el.top_ask.price || 0,
          top_bid_price: el.top_bid && el.top_bid.price || 0,
          timestamp: el.timestamp,
        };
      }));
    }
  }
}

export default Graph;
