import React from 'react';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import RootRef from '@material-ui/core/RootRef';
import ImageIcon from '@material-ui/icons/DragIndicator';
import DeleteIcon from '@material-ui/icons/Delete';

import { getQueue, setQueue, removeFromQueue } from '../services/QueueService';
import { useObservable } from '../hooks/useObservable';

export default function TeamQueue(props) {
    const queue = useObservable(getQueue(), []);

    let reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    let onDragEnd = result => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const newQueue = reorder(
            queue,
            result.source.index,
            result.destination.index
        );

        setQueue(newQueue);
    };

    let removeTeam = team => {
        setQueue(queue.filter(q => q !== team));
    };

    return queue.length > 0 ? (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                    <div ref={provided.innerRef}>
                        <List>
                            {queue.map((item, idx) => (
                                <Draggable
                                    draggableId={item}
                                    key={item}
                                    index={idx}
                                >
                                    {(provided, snapshot) => (
                                        <RootRef rootRef={provided.innerRef}>
                                            <ListItem
                                                dense
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <ListItemIcon>
                                                    <ImageIcon />
                                                </ListItemIcon>
                                                <ListItemText primary={item} />
                                                <IconButton
                                                    onClick={() =>
                                                        removeTeam(item)
                                                    }
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </ListItem>
                                        </RootRef>
                                    )}
                                </Draggable>
                            ))}
                        </List>
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    ) : (
        <div className="flex flex-col flex-grow justify-center items-center content-center">
            <Typography variant="overline" color="inherit">
                No teams queued yet
            </Typography>
        </div>
    );
}
