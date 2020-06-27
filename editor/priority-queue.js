class PriorityQueue{

    queue = [];

    insert(node){
        this.queue.push(node);
    }

    pop(){
        let min = 99999;
        let minIdx = -1;
        
        for(var i=0; i < this.queue.length; i++ ){
            if(this.queue[i].heuristicValue <= min){
                min = this.queue[i].heuristicValue;
                minIdx = i;
            }
        }

        const result = this.queue[minIdx];
        this.queue.splice(minIdx, 1);

        return result;
    }

}