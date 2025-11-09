import pandas as pd
import numpy as np

ATTRIBUTES = ["Length",
              "Scenery",
              "Car Traffic",
              "Foot Traffic",
              "Safety",
              "Urbanization",
              "Steepness",
              "Curvature",
              "Cleanliness"]

RATINGS = {"Length":["Short", "Medium", "Long"],
           "Scenery":["Drab", "Average", "Scenic"],
           "Car Traffic":["Busy", "Average", "Empty"],
           "Foot Traffic":["Busy", "Average", "Empty"],
           "Safety":["Unsafe", "Moderate", "Safe"],
           "Urbanization":["Rural", "Suburban", "Urban"],
           "Steepness":["Flat", "Moderate", "Steep"],
           "Curvature":["Straight", "Moderate", "Winding"],
           "Cleanliness":["Littered", "Moderate", "Clean"],
           "Total Score":["Subpar", "Ok", "Great"]}

class RatingData:
    def __init__(self):
        self.data = pd.DataFrame(np.random.uniform(0,10, size = (3, len(ATTRIBUTES))).round(3), columns = ATTRIBUTES)
        self.add_total()

        self.to_ratings(self.data)
        self.average_row()

    def make_rating_mapper(self, col):
        def rating_mapper(index):
            if col != "Total Score":
                if index <= 3.3:
                    return RATINGS[col][0]
                elif index <= 6.6:
                    return RATINGS[col][1]
                else:
                    return RATINGS[col][2]
            else:
                if index <= 80/3:
                    return RATINGS[col][0]
                elif index <= 80*2/3:
                    return RATINGS[col][1]
                else:
                    return RATINGS[col][2]
        return rating_mapper

    def add_row(self, row_values):
        new_row  = {} 
        for value, attr in zip(row_values, ATTRIBUTES):
            new_row[attr] = value

        self.data= pd.concat([self.data, pd.DataFrame([new_row])])

    def add_row_list(self, row_list):
        for row in row_list:
            self.add_row(row)

    def add_total(self):
        self.data["Total Score"] = self.data.sum(axis=1)

    def to_ratings(self, input_df):
        self.rated_data = input_df.copy()
        for col in self.rated_data.columns:
            self.rated_data[col] = self.rated_data[col].apply(self.make_rating_mapper(col))

        return self.rated_data

    def average_row(self):
        self.average_row = self.data.mean().to_frame().T
        self.rated_average_row = self.to_ratings(self.average_row)
        return self.average_row
    
    def to_csv(self, df, output_file_name):
        df.to_csv(output_file_name)

    def test(self):
        print(self.data.head(5))
        print(self.rated_data.head(5))
        print()
        print()
        print(self.average_row.head())
        print(self.rated_average_row.head())


if __name__ == "__main__":
    test_frame = RatingData()
    test_frame.test()