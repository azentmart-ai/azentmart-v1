from datetime import date


def validate_date_range(
    start_date: date,
    end_date: date
) -> None:
    if end_date < start_date:
        raise ValueError(
            "End date cannot be before start date."
        )
