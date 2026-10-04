def run(ns, case):
    schedule = [[Interval(start, end) for start,end in employee] for employee in case['schedule']]
    result = ns['Solution']().employeeFreeTime(schedule)
    return [[interval.start, interval.end] for interval in result]
