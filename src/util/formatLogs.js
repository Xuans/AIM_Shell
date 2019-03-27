const groupby = function (key) {
    let map = {};
    let list = [];
    this.forEach(elem => {
        const index = map[elem[key]] || list.length;
        let data = list[index] || [];

        map[elem[key]] = index;
        list[index] = data;

        data.push(elem);
    });
    return list;
};

const sortby = function (key) {
    return this.sort(function (a, b) {
        return a[key] - b[key];
    });
};

export default function (schedules) {
    if (schedules && schedules.length) {
       return sortby.call(groupby.call(schedules, 'context_id'), 'schedule_order');
    }
}