const TodoItem = ({ id, label, is_done, handleDelete, handleToggle}) => {
    return (
        <li key={id} className="list-group-item">
            <div className="d-flex justify-content-between">
                <input 
                    className="form-check-input me-2" 
                    type="checkbox" 
                    checked={is_done} 
                    onChange={() => handleToggle(id)}
                />
                <div className={`text-start flex-grow-1 ${is_done ? 'text-decoration-line-through' : ''}`}>
                    {label}
                </div>
                <i 
                    className="fa-solid fa-trash cursor-pointer myTrashCan"
                    onClick={() => handleDelete(id)}
                ></i>
            </div>
        </li>
    );
};

export default TodoItem;

